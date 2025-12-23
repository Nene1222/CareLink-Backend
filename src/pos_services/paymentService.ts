import { execFile } from "child_process";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
// If TOKEN is stored in env:
// const TOKEN = process.env.TOKEN || "";
const TOKEN = process.env.TOKEN || "";

// Convert callback → Promise utility
function execPython(scriptPath: string, args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    execFile("python", [scriptPath, ...args], (err, stdout) => {
      if (err) return reject(err);

      try {
        resolve(JSON.parse(stdout));
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

export async function generateQR(amount: any): Promise<any> {
  const script = path.join(__dirname, "../pos_pythons/generate_qr.py");

  const amountValue =
    typeof amount === "object" ? amount.amount : amount;

  return execPython(script, [TOKEN, String(amountValue)]);
}

export async function checkPayment(md5: string): Promise<any> {
  const script = path.join(__dirname, "../pos_pythons/check_md5.py");

  return execPython(script, [TOKEN, md5]);
}
