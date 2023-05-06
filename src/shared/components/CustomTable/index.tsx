import React, { useRef } from "react";
import i18n from "@dhis2/d2-i18n";
import {
  DataTable,
  DataTableColumnHeader,
  TableHead,
  DataTableCell,
  DataTableRow,
  TableBody,
  TableFoot,
  Pagination,
} from "@dhis2/ui";
import { uid } from "@hisptz/dhis2-utils";
import classes from "./CustomTable.module.css";
import { Column, CustomTableProps } from "../../interfaces";

function CustomTableRow({
  columns,
  row,
}: {
  row: Record<string, any>;
  columns: Column[];
}) {
  const tableId = useRef(uid());
  const rowRef = useRef<string>(uid());

  return (
    <DataTableRow className={classes.row} dataTest={`${rowRef.current}-row`}>
      {columns.map(({ key }) => (
        <DataTableCell key={`${tableId.current}-${key}-column`}>
          {row[key]}
        </DataTableCell>
      ))}
    </DataTableRow>
  );
}

export default function CustomTable({
  columns,
  data,
  pagination,
  emptyTableMessage,
}: CustomTableProps): React.ReactElement {
  const tableId = useRef(uid());
  return (
    <DataTable>
      <TableHead>
        <DataTableRow>
          {columns.map(({ key, label }) => (
            <DataTableColumnHeader
              dataTest={`${label}-column`}
              key={`${tableId.current}-${key}-column-header`}
            >
              {label}
            </DataTableColumnHeader>
          ))}
        </DataTableRow>
      </TableHead>
      <TableBody>
        {data && data.length ? (
          data.map((row, index) => (
            <CustomTableRow
              key={`${tableId.current}-${index}-row`}
              row={row}
              columns={columns}
            />
          ))
        ) : (
          <DataTableRow className={classes.row}>
            <DataTableCell
              colSpan={`${columns.length}`}
              key={`${tableId.current}-column`}
            >
              <div className={classes["empty-table-message"]}>
                {emptyTableMessage ?? i18n.t("There are no data available!")}
              </div>
            </DataTableCell>
          </DataTableRow>
        )}
      </TableBody>
      {pagination && data.length ? (
        <TableFoot>
          <DataTableRow>
            <DataTableCell colSpan={`${columns.length}`}>
              <Pagination
                {...pagination}
                hidePageSizeSelect={!pagination.onPageSizeChange}
              />
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      ) : null}
    </DataTable>
  );
}
