import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";


const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};


export default function AvgTable({ users = [], isLoading }) {
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "avgTimeSpent",
    direction: "ascending",
  });

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // If sorting by avgTimeSpent, compare as numbers (not formatted strings)
      if (sortDescriptor.column === "avgTimeSpent") {
        first = parseFloat(first);
        second = parseFloat(second);
      }

      let cmp = first < second ? -1 : 1;
      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });
  }, [users, sortDescriptor]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-serif">
        Average times
      </h1>
      <Table
        aria-label="User average time table"
        classNames={{
          table: "min-h-[100px]",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="avgTimeSpent" align="end" allowsSorting>
            Avgerage Time
          </TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={sortedUsers}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.user_id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "avgTimeSpent" ? formatTime(item.avgTimeSpent) : getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
