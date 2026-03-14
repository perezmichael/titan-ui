import { FileText } from 'lucide-react';

interface FileAttachmentProps {
  fileName: string;
  fileSize?: string;
}

export function FileAttachment({ fileName, fileSize }: FileAttachmentProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 mt-2 max-w-sm">
      <div className="w-8 h-8 bg-[#5a7a5e] rounded flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-900 truncate">{fileName}</div>
        {fileSize && <div className="text-[10px] text-gray-500">{fileSize}</div>}
      </div>
    </div>
  );
}
