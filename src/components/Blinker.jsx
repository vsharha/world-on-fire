import {getSentimentColor} from "@/lib/utils";

function Blinker({sentiment}) {
    const color = getSentimentColor(sentiment);

    return (
        <div className="w-2 aspect-square rounded-full animate-pulse" style={{backgroundColor:color}}></div>
    );
}

export default Blinker;