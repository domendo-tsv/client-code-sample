import { styled } from "baseui"

export const CollectionPageContainer = styled("div", ({ $theme }) => ({
    display: "flex",
    flex: 1,
    marginTop: "24px",
    marginBottom: "24px",
    backgroundColor: $theme.colors.mono100,
    border: `solid 1px ${$theme.colors.borderOpaque}`,
    "@media screen and (max-width: 1280px)": {
        marginLeft: "24px",
        marginRight: "24px",
    },
}))

type CustomSideContainer = { padding?: string }

export const SideContainer = styled<"div", CustomSideContainer>("div", ({ $theme, padding }) => ({
    display: "flex",
    flexDirection: "column",
    maxWidth: "250px",
    padding: padding,
    width: "100%",
    gridGap: "12px",
    borderRight: `solid 1px ${$theme.colors.borderOpaque}`,
    "@media screen and (max-width: 769px)": {
        display: "none",
    },
}))

export const MainContainer = styled("div", () => ({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: "12px",
}))
