    interface ProfileInstrumentsProps {
            instruments?: string[];
    }

    export function ProfileInstruments({ instruments }: ProfileInstrumentsProps) {
        return (
            <>
                {instruments && instruments.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                        {instruments.map((instrument: string, idx: number) => (
                            <span key={idx} className="bg-highlight text-white px-4 py-2 rounded-md text-xl">
                                {instrument}
                            </span>
                        ))}
                    </div>
                )}
            </>
        );
    }