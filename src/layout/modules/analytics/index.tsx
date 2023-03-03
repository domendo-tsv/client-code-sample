import { styled } from "baseui"

export const AnalyticsPageContainer = styled("div", () => ({
    display: "flex",
    flexDirection: "column",
    marginTop: "24px",
    marginBottom: "24px",
    gridGap: "32px",
    "@media screen and (max-width: 1280px)": {
        marginLeft: "24px",
        marginRight: "24px",
    },
}))
