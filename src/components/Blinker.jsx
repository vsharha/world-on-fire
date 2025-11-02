import {getSentimentColor} from "@/lib/utils";

function Blinker({sentiment}) {
    const color = getSentimentColor(sentiment);

    return (
        <div className="flex flex-row justify-between items-center pr-1">
            {/*<span className="text-xs">S:</span>*/}
            <div className="flex flex-row gap-3 items-center">
                <span className="text-xs">{sentiment.toFixed(2)}</span>
                <div className="w-2 h-2 aspect-square rounded-full animate-pulse" style={{backgroundColor:color}}></div>
            </div>
        </div>
    );
}

export default Blinker;