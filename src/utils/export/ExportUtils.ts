import { format } from "date-fns"
import { t } from "i18next"
import { Conditions } from "../../constants"
import { CollectedProduct, ExportedProduct, VaultProduct } from "../../interfaces"
import { VaultPages } from "../../modules/vault"
import AppFormatter from "../../stores/AppFormatter"

export class ExportUtils {
    public static generateExportedProducts(product: CollectedProduct): ExportedProduct[] {
        const getPriceDiff = (vaultProduct: VaultProduct) => {
            return (vaultProduct.soldPrice ?? 0) - (vaultProduct.soldFees ?? 0) - (vaultProduct.buyPrice + vaultProduct.buyFees)
        }

        return product.productsInVault.map((vaultProduct) => ({
            name: product.name,
            colorway: product.colorway ?? "/",
            sku: product.sku ?? "/",
            qty: vaultProduct.qty.toString(),
            condition: Conditions.find((e) => e.value === vaultProduct.condition)?.text ?? "",
            status: t(`vault.enums.vault_product_status.${vaultProduct.status}`),
            buyPrice: AppFormatter.PriceFormater.format(vaultProduct.buyPrice),
            buyFees: AppFormatter.PriceFormater.format(vaultProduct.buyFees),
            buyDate: vaultProduct.buyDate ? format(new Date(vaultProduct.buyDate!), "PP") : "",
            purchasePlatform: t(`platforms.${vaultProduct.purchasePlatform}`),
            listedPrice: vaultProduct.listedPrice ? AppFormatter.PriceFormater.format(vaultProduct.listedPrice) : "/",
            soldPrice: vaultProduct.soldPrice ? AppFormatter.PriceFormater.format(vaultProduct.soldPrice) : "/",
            soldFees: vaultProduct.soldFees ? AppFormatter.PriceFormater.format(vaultProduct.soldFees) : "/",
            gainLoss: AppFormatter.PriceFormater.format(getPriceDiff(vaultProduct)),
            soldDate: vaultProduct.soldDate ? format(new Date(vaultProduct.soldDate), "PP") : "/",
            soldPlatform: vaultProduct.soldPlatform ? t(`platforms.${vaultProduct.soldPlatform}`) : "/",
            note: vaultProduct.note ?? "/",
            size: AppFormatter.SizeSystem.getSizeString(vaultProduct.variant.sizeChart),
        }))
    }

    public static generateCSVRows(vaultTab: VaultPages, products: ExportedProduct[], keys: (keyof ExportedProduct)[]): string[][] {
        const headers = keys.map((key) => this.MapProductKeyText[key])
        const data: string[][] = [headers]
        for (const product of products) {
            const rowData = keys.map((key) => product[key])
            data.push(rowData)
        }

        return data
    }

    public static MapProductKeyText: Record<keyof ExportedProduct, string> = {
        name: t("common.name"),
        colorway: t("common.colorway"),
        sku: t("common.sku"),
        size: t("common.size"),
        qty: t("common.quantity"),
        status: t("common.status"),
        purchasePlatform: t("collection.purchase_platform"),
        condition: t("collection.condition"),
        buyPrice: t("filter.purchase_price"),
        buyFees: t("collection.purchase_fees"),
        buyDate: t("filter.purchase_date"),
        listedPrice: t("collection.expected_payout"),
        soldPrice: t("collection.sold_price"),
        soldFees: t("collection.sold_fees"),
        soldDate: t("collection.sold_date"),
        soldPlatform: t("collection.history.sold_platform"),
        gainLoss: t("common.gain_loss"),
        note: t("collection.note"),
    }

    public static get VaultTabKeys(): { [key in VaultPages]: (keyof ExportedProduct)[] } {
        return {
            [VaultPages.InVault]: [
                "name",
                "colorway",
                "sku",
                "size",
                "qty",
                "status",
                "buyPrice",
                "buyFees",
                "buyDate",
                "purchasePlatform",
                "listedPrice",
                "note",
            ],
            [VaultPages.Listings]: [
                "name",
                "colorway",
                "sku",
                "size",
                "qty",
                "status",
                "buyPrice",
                "buyFees",
                "buyDate",
                "purchasePlatform",
                "listedPrice",
                "note",
            ],
            [VaultPages.History]: [
                "name",
                "colorway",
                "sku",
                "size",
                "qty",
                "condition",
                "buyPrice",
                "buyFees",
                "buyDate",
                "purchasePlatform",
                "soldPrice",
                "soldFees",
                "soldDate",
                "soldPlatform",
                "gainLoss",
                "note",
            ],
        }
    }
}
