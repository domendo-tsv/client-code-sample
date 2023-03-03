import Joi from "joi"
import { pick } from "lodash"
import { makeAutoObservable, runInAction } from "mobx"
import { VaultProductStatus } from "../../enums"
import { CollectedProduct, CreateUpdateVaultProduct, Product, VaultProduct } from "../../interfaces"
import { Validation } from "../../layout/validation"
import Api from "../../services/Api"

export class EditVaultProductStore {
    private _id: string | null = null
    private _data: CreateUpdateVaultProduct | null = null
    private _originalDataJson: string | null = null

    private _vaultProduct: VaultProduct | null = null
    private _product: Product | null = null

    private _schema: Validation<CreateUpdateVaultProduct>

    constructor(
        schema: Joi.Schema<CreateUpdateVaultProduct>,
        public readonly pickSettingsValues: (keyof CreateUpdateVaultProduct)[],
        public readonly isDuplicate: boolean,
    ) {
        this._schema = new Validation<CreateUpdateVaultProduct>(schema, { allowUnknown: true })

        makeAutoObservable(this)
    }

    get hasItemChanged() {
        return this._originalDataJson !== JSON.stringify(this._data)
    }

    get isValid() {
        if (this._originalDataJson && !this.isDuplicate) {
            return this.hasItemChanged && this._schema.isValid
        }

        return this._schema.isValid
    }

    get isEdit() {
        return this._id
    }

    get data() {
        return this._data
    }

    get vaultProduct() {
        return this._vaultProduct
    }

    get product() {
        return this._product
    }

    get productId() {
        return this._product?.id
    }

    public setValue<K extends keyof CreateUpdateVaultProduct, V extends CreateUpdateVaultProduct[K]>(key: K, value: V | undefined) {
        this._data ??= {} as CreateUpdateVaultProduct

        if (value === undefined) {
            delete this._data[key]
        } else {
            this._data[key] = value
        }

        this._schema.validate(this._data)
    }

    public async loadProductInfo(productId: string) {
        const product = await Api.get<Product>(`/products/${productId}`)

        runInAction(() => {
            this._product = product
            this.setValue("status", VaultProductStatus.InStock)
        })
    }

    public async load(vaultProductId?: string) {
        const vaultProduct = await Api.get<VaultProduct>(`/vault/products/collected/${vaultProductId}`)

        runInAction(() => {
            if (vaultProduct?.product) {
                this._product = vaultProduct.product
            }

            this._vaultProduct = vaultProduct
            this._id = vaultProduct.id
            this._data = pick(vaultProduct, this.pickSettingsValues) as CreateUpdateVaultProduct

            if (vaultProduct.collections) {
                this._data.collectionIds = vaultProduct.collections?.map((e) => e.id)
            }

            this._data.variantId = vaultProduct.variant.id

            this._originalDataJson = JSON.stringify(this._data)
            this._schema.validate(this._data)
        })
    }

    public async duplicate(body: Partial<CreateUpdateVaultProduct>) {
        if (!this._data || !this._product) {
            return
        }

        await Api.post<CollectedProduct>(`/vault/products/collected/${this._id}/duplicate`, body)
    }

    public async save() {
        if (!this._data || !this._product) {
            return
        }

        if (this.isDuplicate) {
            await this.duplicate(this._data)
            return
        }

        this._id
            ? await Api.patch<CollectedProduct>(`/vault/products/collected/${this._id}`, this._data)
            : await Api.post<CollectedProduct>(`/vault/products/${this.productId}`, this._data)
    }
}
