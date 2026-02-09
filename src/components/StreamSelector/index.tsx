'use client';

import "./index.scss";

interface Stream {
    cleanName: string;
    url: string;
    quality: string;
    language: string;
    size: string;
}

interface StreamSelectorProps {
    streams: Stream[];
    onSelect: (stream: Stream) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
export const StreamSelector = (props: StreamSelectorProps) => {

    return (
        <div className="relative inline-block text-left w-full max-w-sm">
            {props.isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-[#181818] border border-gray rounded-md shadow-2xl max-h-96 overflow-y-auto">
                    <div className="py-1">
                        {props.streams.length > 0 ? (
                            props.streams.map((stream, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        props.onSelect(stream);
                                        props.setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-[#2f2f2f] border-b border-gray-800 last:border-0 flex flex-col"
                                    >
                                        <span className="text-white text-sm font-semibold truncate">
                                            {stream.cleanName}
                                        </span>
                                        <div className="flex gap-2 mt-1 items-center">
                                            <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 rounded uppercase">
                                                {stream.quality}
                                            </span>
                                            <span className="text-xs text-red-500 font-medium">{stream.language}</span>
                                            <span className="text-[10px] text-gray-500 italic">
                                                {stream.size}
                                            </span>
                                        </div>
                                    </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                Nenhum Link Compativel encontrado
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
