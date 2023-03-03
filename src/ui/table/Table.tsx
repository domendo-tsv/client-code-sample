import { TableBuilder, TableBuilderProps } from "baseui/table-semantic"
import { observer } from "mobx-react-lite"
import { VaultProduct } from "../../interfaces"

type ITable = TableBuilderProps<VaultProduct>

export const Table = observer(({ ...props }: ITable) => {
    return (
        <TableBuilder
            overrides={{
                TableHeadCell: {
                    style: {
                        fontSize: "12px",
                        paddingTop: "6px",
                        paddingRight: "8px",
                        paddingLeft: "8px",
                    },
                },
                TableBodyCell: {
                    style: {
                        verticalAlign: "middle",
                        padding: "0px",
                    },
                },
            }}
            {...props}
        />
    )
})
