import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { Check } from "baseui/icon"
import { Input } from "baseui/input"
import { StyledLink } from "baseui/link"
import { useSnackbar } from "baseui/snackbar"
import { LabelLarge } from "baseui/typography"
import { observable, runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { ErrorMessage } from "../../../components"
import { ErrorCode, HandledError } from "../../../error"
import AuthService from "../../../services/AuthService"

interface ForgotPasswordInfo {
    email: string
}

export const ForgotPasswordPage = observer(() => {
    const { t } = useTranslation()
    const [css, theme] = useStyletron()
    const { search } = useLocation()
    const { enqueue } = useSnackbar()

    const state = useLocalObservable(
        () => ({
            enqueue,
            data: null as ForgotPasswordInfo | null,
            isLoading: false,

            error: null as HandledError | null,

            setValue<K extends keyof ForgotPasswordInfo, V extends ForgotPasswordInfo[K]>(key: K, value: V) {
                this.data ??= {} as ForgotPasswordInfo
                this.data[key] = value
            },

            async sendForgotPasswordEmail(): Promise<void> {
                this.isLoading = true
                this.error = null

                let error: HandledError | null = null
                try {
                    this.validate(this.data)
                    await AuthService.sendForgotPasswordEmail(this.data!.email)
                } catch (err) {
                    error = err
                }

                runInAction(() => {
                    if (!error) {
                        this.enqueue({ startEnhancer: ({ size }) => <Check size={size} />, message: t("auth.reset_password_link_sent") })
                    }

                    this.error = error
                    this.isLoading = false
                })
            },

            validate(data: ForgotPasswordInfo | null) {
                if (!data || !data.email) {
                    throw new HandledError(ErrorCode.FormEmailEmpty, "Email missing")
                }

                const validateEmail = (email: string) => {
                    return email
                        .toLowerCase()
                        .match(
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        )
                }

                if (!validateEmail(data.email)) {
                    throw new HandledError(ErrorCode.FormInvalidEmail, "Invalid Email")
                }
            },
        }),
        { enqueue: observable.ref },
    )

    return (
        <Block display="flex" height="100%" justifyContent="center" margin="16px">
            <Block display="flex" width="100%" maxWidth={["100%", "100%", "360px"]} flexDirection="column" margin={["0px", "0px", "auto", "auto"]}>
                <Block display="flex" marginBottom="12px">
                    <LabelLarge font={["font550", "font550", "font650"]}>{t("auth.whats_your_email")}</LabelLarge>
                </Block>

                <Block>
                    <Input
                        placeholder={t("auth.enter_email")}
                        value={state.data?.email ?? ""}
                        onChange={(value) => state.setValue("email", value.target.value)}
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
                        onClick={state.sendForgotPasswordEmail}
                    >
                        {t("common.submit")}
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
                    <StyledLink
                        className={css({
                            fontSize: "14px !important",
                        })}
                        href={`/auth/login${search}`}
                    >
                        {t("auth.back_to_sign_in")}
                    </StyledLink>
                </Block>
            </Block>
        </Block>
    )
})
