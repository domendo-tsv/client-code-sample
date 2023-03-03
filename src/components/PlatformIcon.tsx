import { useTranslation } from "react-i18next"
import FbLogo from "../assets/images/fb.png"
import FootlockerLogo from "../assets/images/footlocker.png"
import GoatLogo from "../assets/images/goat.webp"
import RestocksLogo from "../assets/images/restocks.png"
import StockXLogo from "../assets/images/stockx.png"
import { AdidasIcon, ConfirmedIcon, EbayIcon, JDIcon, KlektIcon, LocalIcon, MarketIcon, NikeIcon, SnkrsIcon } from "../ui/icons"

interface IPlatformIcon {
    platform: string
    size?: string
}

export const PlatformIcon: React.FC<IPlatformIcon> = ({ platform, size }: IPlatformIcon) => {
    const { t } = useTranslation()

    let source
    switch (platform) {
        case "snkrs":
            return <SnkrsIcon width={size} />
        case "nike":
            return <NikeIcon width={size} />
        case "klekt":
            return <KlektIcon width={size} />
        case "jd":
            return <JDIcon width={size} />
        case "ebay":
            return <EbayIcon height={size} />
        case "local":
            return <LocalIcon width={size} />
        case "adidas":
            return <AdidasIcon width={size} />
        case "confirmed":
            return <ConfirmedIcon width={size} />
        case "other":
            return <MarketIcon width={size} />

        case "fb_marketplace":
            source = FbLogo
            break
        case "stockx":
            source = StockXLogo
            break
        case "footlocker":
            source = FootlockerLogo
            break
        case "goat":
            source = GoatLogo
            break
        case "restocks":
            source = RestocksLogo
            break

        default:
            break
    }

    if (source) {
        return <img src={source} alt={t(`platforms.${platform}`)} height={size} width={size} />
    }

    return null
}

PlatformIcon.defaultProps = {
    size: "24px",
}
