
import { KiteSvg1, KiteSvg2, KiteSvg3, KiteSvg4, KiteSvg5 } from './Kites'
import { FireCrackerSvg1 } from './FireCrackers'


export function SvgDisplay() {
    return (
        <div className="flex flex-row w-full h-fit gap-2.5 bg-blue-50">
            <div className="p-5">
                <KiteSvg1 />
            </div>
            <div className="p-5">
                <KiteSvg2 />
            </div>
            <div className="p-5">
                <KiteSvg3 />
            </div>
            <div className="p-5">
                <KiteSvg4 />
            </div>
            <div className="p-5">
                <KiteSvg5 />
            </div>
            <div className="p-5">
                <FireCrackerSvg1 />
            </div>
        </div>
    );
}