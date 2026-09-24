import Link from "next/link";
import DesignEditor from "@/components/DesignEditor";
export default function NewDesignPage() {
  return (
    <div>
      <Link
        className="text-sm font-bold text-[#147ee8]"
        href="/admin/3d-designs"
      >
        ← 3D Designs
      </Link>
      <h1 className="mt-3 text-3xl font-black">Create a 3D design</h1>
      <DesignEditor />
    </div>
  );
}
