"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

async function generatePDF(url: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const session = data?.session;
  if (!session)
    throw new Error("No supabase session available for PDF export.");

  const accessToken = session.access_token;
  const refreshToken = session.refresh_token;
  const expiresAt = session.expires_at ? Number(session.expires_at) : undefined; // optional

  let browser;
  try {
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer: typeof import("puppeteer") | typeof import("puppeteer-core"),
      launchOptions: {
        headless: boolean;
        args?: string[];
        executablePath?: string;
      };
    launchOptions = { headless: true };

    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium")).default;
      puppeteer = await import("puppeteer-core");
      launchOptions = {
        headless: 'shell',
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      };
    } else {
      puppeteer = await import("puppeteer");
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // determine cookie domain & secure flag
    const urlObj = new URL(url);
    const cookieDomain = urlObj.hostname; // hostname strips port (good)
    const isHttps = urlObj.protocol === "https:";

    // set Supabase session cookies on the BrowserContext BEFORE navigation
    // cookie names used by SSR: sb-access-token and sb-refresh-token
    await page.browserContext().setCookie({
      name: `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token`,
      value: JSON.stringify(session), // @supabase/ssr stores the whole session here
      domain: new URL(url).hostname,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });

    // Optional debug (uncomment if you need to inspect cookies)
    // const cookies = await page.browserContext().cookies();
    // console.log('Puppeteer cookies for url:', cookies);

    // Now navigate: the request to your Next server will include these cookies
    await page.goto(url, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    return pdfBuffer;
  } catch (err) {
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset
  ) as ArrayBuffer;
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/export/[id]">
) {
  const { id } = await ctx.params;

  let host = _req.headers.get("host");
  if (host?.startsWith("localhost")) {
    host = "http://" + host;
  } else {
    host = "https://" + host;
  }

  try {
    const pdfBuffer = await generatePDF(host + "/cv-preview/" + id);

    const newHeaders = new Headers();
    newHeaders.set("Content-Type", "application/pdf");
    newHeaders.set("Content-Disposition", `attachment; filename=cv-${id}.pdf`);
    return new Response(typedArrayToBuffer(pdfBuffer), { headers: newHeaders });
  } catch (error) {
    return new Response("An error occurred while generating the pdf.", {
      status: 500,
    });
  }
}
