const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvzylaqk";
const MAX_BODY_BYTES = 16 * 1024;
const LIMITS = {
  name: 120,
  email: 254,
  topic: 120,
  message: 4000,
  subject: 140,
};

function redirect(res, location) {
  res.statusCode = 303;
  res.setHeader("Location", location);
  res.end();
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
      total += buffer.length;
      if (total > MAX_BODY_BYTES) {
        reject(new Error("Request body too large."));
        req.destroy();
        return;
      }
      chunks.push(buffer);
    });

    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function isValidEmail(email) {
  if (!email || email.length > LIMITS.email || /\s/.test(email)) return false;
  const [local, domain, ...extra] = email.split("@");
  if (!local || !domain || extra.length || local.length > 64 || domain.length > 253) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function withinLimit(value, limit, required = true) {
  const trimmed = String(value || "").trim();
  if (required && !trimmed) return false;
  return trimmed.length <= limit;
}

function validate(fields) {
  return (
    withinLimit(fields.get("name"), LIMITS.name) &&
    isValidEmail(String(fields.get("email") || "").trim()) &&
    withinLimit(fields.get("topic"), LIMITS.topic) &&
    withinLimit(fields.get("message"), LIMITS.message) &&
    withinLimit(fields.get("_subject"), LIMITS.subject, false)
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.statusCode = 405;
    res.end("Method not allowed");
    return;
  }

  const successUrl = "/contact/?sent=1#contact-form";
  const errorUrl = "/contact/?error=1#contact-form";

  try {
    const body = await readBody(req);
    const fields = new URLSearchParams(body);

    if (String(fields.get("_gotcha") || "").trim()) {
      redirect(res, successUrl);
      return;
    }

    if (!validate(fields)) {
      redirect(res, errorUrl);
      return;
    }

    fields.set("email", String(fields.get("email") || "").trim());
    fields.set("name", String(fields.get("name") || "").trim());
    fields.set("topic", String(fields.get("topic") || "").trim());
    fields.set("message", String(fields.get("message") || "").trim());
    fields.set("_next", successUrl);

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: fields.toString(),
    });

    redirect(res, response.ok ? successUrl : errorUrl);
  } catch (error) {
    redirect(res, errorUrl);
  }
};
