import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { styled, useStyletron, withStyle } from "baseui"
import { Block } from "baseui/block"
import { Button, ButtonOverrides } from "baseui/button"
import { ALIGN, HeaderNavigation as MainNavigation, StyledNavigationItem, StyledNavigationList } from "baseui/header-navigation"
import { Delete, Grab, Overflow } from "baseui/icon"
import { StatefulMenu } from "baseui/menu"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import { HeadingLarge } from "baseui/typography"
import { AnimatePresence } from "framer-motion"
import { observer } from "mobx-react-lite"
import AuthStore from "../stores/AuthStore"
import { DiscordLogo, EditIcon, LogoutIcon, SettingsIcon, TheSoleVaultIcon } from "../ui/icons"

const NavigationContent = styled("div", {
    position: "relative",
    display: "flex",
    backgroundColor: "black",
    justifyContent: "center",
})

const CustomNavigationItem = withStyle(StyledNavigationItem, {
    paddingLeft: "8px",
})

const CustomNavigationList = withStyle(StyledNavigationList, {
    "@media screen and (max-width: 600px)": {
        display: "none",
    },
})

const CustomMobileNavigationList = withStyle(StyledNavigationList, {
    "@media screen and (min-width: 600px)": {
        display: "none",
    },
})

export const HeaderNavigation = observer(() => {
    const { t } = useTranslation()
    const [css, theme] = useStyletron()
    const navigate = useNavigate()

    const { pathname } = useLocation()

    const [isMobileMenu, setMobileMenu] = useState(false)

    const enableMenu = AuthStore.isAuthenticated && AuthStore.isProfileCompleted

    const getButtonOverride = (isSelected: boolean): ButtonOverrides => {
        return {
            BaseButton: {
                style: ({ $theme }) => ({
                    color: isSelected ? $theme.colors.primaryA : $theme.colors.primaryB,
                    ":hover": {
                        color: $theme.colors.primaryA,
                    },
                }),
            },
        }
    }

    return (
        <NavigationContent>
            <MainNavigation
                overrides={{
                    Root: {
                        style: ({ $theme }) => ({
                            flex: 1,
                            maxWidth: "1280px",
                            backgroundColor: $theme.colors.mono1000,
                            borderBottomWidth: "0px",
                            "@media screen and (max-width: 1280px)": {
                                paddingRight: "10px",
                                paddingLeft: "10px",
                            },
                        }),
                    },
                }}
            >
                <StyledNavigationList $align={ALIGN.left}>
                    <CustomNavigationItem>
                        <Block
                            display="flex"
                            alignItems="center"
                            width={["150px", "150px", "150px", "180px"]}
                            onClick={() => navigate("/")}
                            className={css({
                                cursor: "pointer",
                            })}
                        >
                            <TheSoleVaultIcon width="100%" />
                        </Block>
                    </CustomNavigationItem>
                </StyledNavigationList>
                <StyledNavigationList $align={ALIGN.center} />
                {enableMenu && (
                    <Fragment>
                        <CustomNavigationList $align={ALIGN.right} style={{ paddingRight: "0px" }}>
                            <CustomNavigationItem>
                                <Button
                                    onClick={() => navigate("/vault")}
                                    kind="tertiary"
                                    size="compact"
                                    isSelected={pathname.startsWith("/vault")}
                                    overrides={getButtonOverride(pathname.startsWith("/vault"))}
                                >
                                    {t("common.vault")}
                                </Button>
                            </CustomNavigationItem>
                            <CustomNavigationItem>
                                <Button
                                    onClick={() => navigate("/analytics")}
                                    kind="tertiary"
                                    size="compact"
                                    isSelected={pathname.startsWith("/analytics")}
                                    overrides={getButtonOverride(pathname.startsWith("/analytics"))}
                                >
                                    {t("common.analytics")}
                                </Button>
                            </CustomNavigationItem>
                            <CustomNavigationItem>
                                <StatefulPopover
                                    focusLock
                                    placement={PLACEMENT.topRight}
                                    content={({ close }) => (
                                        <StatefulMenu
                                            items={[
                                                {
                                                    label: (
                                                        <Block display="flex" alignItems="center" gridGap="12px">
                                                            <EditIcon width="14px" />
                                                            {t("common.edit_account")}
                                                        </Block>
                                                    ),
                                                    onClick: () => navigate("/account/profile"),
                                                },
                                                {
                                                    label: (
                                                        <Block display="flex" alignItems="center" gridGap="12px">
                                                            <SettingsIcon width="14px" />
                                                            {t("common.settings")}
                                                        </Block>
                                                    ),
                                                    onClick: () => navigate("/account/settings"),
                                                },
                                                {
                                                    label: (
                                                        <Block display="flex" alignItems="center" gridGap="12px">
                                                            <DiscordLogo width="14px" />
                                                            {t("platforms.discord")}
                                                        </Block>
                                                    ),
                                                    onClick: () => window.open("https://discord.gg/PEPsTjtzty", "_blank", "noreferrer"),
                                                },
                                                {
                                                    label: (
                                                        <Block display="flex" alignItems="center" gridGap="12px">
                                                            <LogoutIcon width="14px" />
                                                            {t("common.logout")}
                                                        </Block>
                                                    ),
                                                    onClick: AuthStore.logout,
                                                },
                                            ]}
                                            onItemSelect={(item) => {
                                                item.item.onClick()
                                                close()
                                            }}
                                        />
                                    )}
                                >
                                    <Button size="mini">
                                        <Overflow size={24} />
                                    </Button>
                                </StatefulPopover>
                            </CustomNavigationItem>
                        </CustomNavigationList>
                        <CustomMobileNavigationList $align={ALIGN.right}>
                            <Button size="mini" onClick={() => setMobileMenu(!isMobileMenu)}>
                                {!isMobileMenu ? (
                                    <Grab color={theme.colors.mono100} size="24px" />
                                ) : (
                                    <Delete color={theme.colors.mono100} size="24px" />
                                )}
                            </Button>
                        </CustomMobileNavigationList>
                    </Fragment>
                )}
            </MainNavigation>

            <AnimatePresence initial={false}>
                {isMobileMenu && (
                    <Block
                        className={css({
                            position: "absolute",
                            top: "60px",
                            zIndex: 10,
                            width: "100%",
                            height: "calc(100vh - 60px)",
                            backgroundColor: theme.colors.mono100,
                        })}
                    >
                        <Block
                            className={css({
                                display: "flex",
                                paddingRight: "24px",
                                paddingLeft: "24px",
                                gridGap: "32px",
                                flexDirection: "column",
                                backgroundColor: theme.colors.mono100,
                            })}
                        >
                            <Block display="flex" justifyContent="space-between">
                                <Block display="flex" flexDirection="column">
                                    <HeadingLarge
                                        marginTop="16px"
                                        marginBottom="16px"
                                        onClick={() => {
                                            navigate("/vault")
                                            setMobileMenu(!isMobileMenu)
                                        }}
                                    >
                                        {t("common.vault")}
                                    </HeadingLarge>
                                    <HeadingLarge
                                        marginTop="16px"
                                        marginBottom="16px"
                                        onClick={() => {
                                            navigate("/analytics")
                                            setMobileMenu(!isMobileMenu)
                                        }}
                                    >
                                        {t("common.analytics")}
                                    </HeadingLarge>
                                    <HeadingLarge
                                        marginTop="16px"
                                        marginBottom="16px"
                                        onClick={() => {
                                            navigate("/account/profile")
                                            setMobileMenu(!isMobileMenu)
                                        }}
                                    >
                                        {t("common.profile")}
                                    </HeadingLarge>
                                </Block>
                                <Block display={["none", "none", "flex"]} marginTop="16px">
                                    <Delete size="40px" onClick={() => setMobileMenu(!isMobileMenu)} />
                                </Block>
                            </Block>

                            <Button onClick={AuthStore.logout} kind="secondary">
                                {t("common.logout")}
                            </Button>
                        </Block>
                    </Block>
                )}
            </AnimatePresence>
        </NavigationContent>
    )
})
