import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { Input } from "baseui/input"
import { StyledLink } from "baseui/link"
import { LabelLarge, LabelSmall } from "baseui/typography"
import { runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { ErrorMessage } from "../../../components"
import { ErrorCode, HandledError } from "../../../error"
import AuthService from "../../../services/AuthService"
import DialogService from "../../../services/DialogService"
import { SignInSocialButton } from "../components"

interface SignInInfo {
    email: string
    password: string
}

export const SignInPage = observer(() => {
    const { t } = useTranslation()
    const [css, theme] = useStyletron()
    const { search } = useLocation()

    const state = useLocalObservable(() => ({
        data: null as SignInInfo | null,

        isLoading: false,
        error: null as HandledError | null,

        setValue<K extends keyof SignInInfo, V extends SignInInfo[K]>(key: K, value: V) {
            this.data ??= {} as SignInInfo
            this.data[key] = value
        },

        async login(): Promise<void> {
            this.isLoading = true
            this.error = null

            let error: HandledError | null = null
            try {
                this.validate(this.data)
                await AuthService.login(this.data!.email, this.data!.password)
            } catch (err) {
                error = err
            }

            runInAction(() => {
                this.error = error
                this.isLoading = false
            })
        },

        validate(data: SignInInfo | null) {
            if (!data || !data.email || !data?.password) {
                throw new HandledError(ErrorCode.FormLoginEmpty, "Form empty")
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

        async signInWithGoogle() {
            try {
                await AuthService.signUpWithGoogle()
            } catch (err) {
                if ((err as HandledError).code !== ErrorCode.PopupClosed) {
                    DialogService.error(err)
                }
            }
        },
    }))

    return (
        <Block display="flex" height="100%" justifyContent="center" margin="16px">
            <Block display="flex" width="100%" maxWidth={["100%", "100%", "360px"]} flexDirection="column" margin={["0px", "0px", "auto", "auto"]}>
                <Block display="flex" marginBottom="12px">
                    <LabelLarge font={["font550", "font550", "font650"]}>{t("auth.whats_your_email")}</LabelLarge>
                </Block>

                <Block display="flex" flexDirection="column" gridGap="12px">
                    <Block>
                        <Input
                            placeholder={t("auth.enter_email")}
                            value={state.data?.email ?? ""}
                            onChange={(value) => state.setValue("email", value.target.value)}
                            maxLength={50}
                        />
                    </Block>
                    <Block>
                        <Input
                            placeholder={t("auth.enter_password")}
                            type="password"
                            value={state.data?.password ?? ""}
                            onChange={(value) => state.setValue("password", value.target.value)}
                            maxLength={50}
                        />
                    </Block>
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
                        onClick={state.login}
                    >
                        {t("common.continue")}
                    </Button>
                </Block>
                <Block display="flex" justifyContent="center" color="" margin="16px 0 16px 0">
                    <LabelSmall
                        className={css({
                            color: theme.colors.primary500,
                            textTransform: "uppercase",
                        })}
                    >
                        {t("common.or").toUpperCase()}
                    </LabelSmall>
                </Block>
                <SignInSocialButton provider="Google" onClick={state.signInWithGoogle} />

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
                        href={`/auth/create-account${search}`}
                    >
                        {t("auth.create_an_account")}
                    </StyledLink>
                    <StyledLink
                        className={css({
                            fontSize: "14px !important",
                        })}
                        href={`/auth/forgot-password${search}`}
                    >
                        {t("auth.forgot_password")}
                    </StyledLink>
                </Block>
            </Block>
        </Block>
    )
})
