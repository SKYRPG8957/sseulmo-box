export default function FileDropzone({ label, accept, multiple, onFiles }: { label: string; accept?: string; multiple?: boolean; onFiles: (files: File[]) => void }) {
  return <label className="block rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center text-sm font-semibold text-slate-700">
    {label}
    <input className="sr-only" type="file" accept={accept} multiple={multiple} onChange={(event) => onFiles(Array.from(event.target.files ?? []))} />
  </label>;
}
