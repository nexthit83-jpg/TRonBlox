import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      background: "black",
      color: "white",
      padding: "12px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        <strong>TRonBlox</strong>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link href="/">Home</Link>
        <Link href="/upload">Upload</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}