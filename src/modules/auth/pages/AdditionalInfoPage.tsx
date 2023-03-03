import { useTranslation } from "react-i18next"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { Input } from "baseui/input"
import { LabelLarge } from "baseui/typography"
import { runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { ErrorMessage } from "../../../components"
import { ErrorCode, HandledError } from "../../../error"
import { IProfile, ValidateResponse } from "../../../interfaces"
import Api from "../../../services/Api"
import AuthStore from "../../../stores/AuthStore"

interface AdditionalInfo {
    username: string
}

export const AdditionalInfoPage = observer(() => {
    const { t } = useTranslation()
    const [css, theme] = useStyletron()

    const state = useLocalObservable(() => ({
        data: null as AdditionalInfo | null,
        isLoading: false,
        error: null as HandledError | null,

        setValue<K extends keyof AdditionalInfo, V extends AdditionalInfo[K]>(key: K, value: V) {
            this.data ??= {} as AdditionalInfo
            this.data[key] = value
        },

        async save(): Promise<void> {
            this.isLoading = true
            let profile: IProfile | null = null
            let error: HandledError | null = null

            const body = { username: this.data?.username }
            this.error = null

            try {
                if (!body.username) {
                    throw new HandledError(ErrorCode.FormEmailEmpty, "Username missing")
                }

                const validateResponse = await Api.get<ValidateResponse>(`/user/verify-username?username=${body.username}`)
                if (!validateResponse.valid) {
                    throw new HandledError(ErrorCode.AccountExists, "Username already exists")
                }

                profile = await Api.post<IProfile>("/user", body)
            } catch (err) {
                error = err
            }

            runInAction(() => {
                if (profile) {
                    AuthStore.updateProfileInfo(profile)
                }

                this.error = error
                this.isLoading = false
            })
        },
    }))

    return (
        <Block display="flex" height="100%" justifyContent="center" margin="16px">
            <Block display="flex" width="100%" maxWidth={["100%", "100%", "360px"]} flexDirection="column" margin={["0px", "0px", "auto", "auto"]}>
                <Block display="flex" marginBottom="12px">
                    <LabelLarge font={["font550", "font550", "font650"]}>{t("auth.additional_info")}</LabelLarge>
                </Block>

                <Block>
                    <Input
                        placeholder={t("auth.enter_username")}
                        value={state.data?.username ?? ""}
                        onChange={(value) => state.setValue("username", value.target.value)}
                        maxLength={50}
                    />
                </Block>
                {state.error ? <ErrorMessage message={state.error.errorMessage} /> : <Block height="24px" />}
                <Block>
                    <Button
                        overrides={{
                            BaseButton: {
                                style: {
                                    width: "100%",
                                },
                            },
                        }}
                        isLoading={state.isLoading}
                        onClick={state.save}
                    >
                        {t("common.continue")}
                    </Button>
                </Block>

                <Block
                    className={css({
                        borderTop: `solid 1px ${theme.colors.primary300}`,
                    })}
                    marginTop="24px"
                    paddingTop="12px"
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                >
                    <LabelLarge
                        className={css({
                            color: theme.colors.primary500,
                        })}
                        font={["font100", "font100", "font200"]}
                    >
                        {t("auth.enter_username_desc")}
                    </LabelLarge>
                </Block>
            </Block>
        </Block>
    )
})
