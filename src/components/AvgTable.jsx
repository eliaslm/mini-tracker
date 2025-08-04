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


export const formatTime = (seconds) => {
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
    const sorted = [...users].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // If sorting by avgTimeSpent, compare as numbers (not formatted strings)
      if (sortDescriptor.column === "avgTimeSpent") {
        first = parseFloat(first);
        second = parseFloat(second);
      }

      // If sorting by name, use the original name (not the display name with medals)
      if (sortDescriptor.column === "name") {
        first = a.name;
        second = b.name;
      }

      let cmp = first < second ? -1 : 1;
      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });

    // Calculate medal positions based on avgTimeSpent ranking (not current sort order)
    const avgTimeRanking = [...users].sort((a, b) => {
      const first = parseFloat(a.avgTimeSpent);
      const second = parseFloat(b.avgTimeSpent);
      return first - second; // Ascending order (fastest first)
    });

    // Create a map of user_id to their avgTimeSpent rank
    const rankMap = new Map();
    avgTimeRanking.forEach((user, index) => {
      rankMap.set(user.user_id, index);
    });

    // Add index and medal info to each user
    return sorted.map((user, index) => ({
      ...user,
      _index: index,
      _avgTimeRank: rankMap.get(user.user_id)
    }));
  }, [users, sortDescriptor]);

  const getMedalEmoji = (avgTimeRank) => {
    if (avgTimeRank === 0) return "🥇 ";
    if (avgTimeRank === 1) return "🥈 ";
    if (avgTimeRank === 2) return "🥉 ";
    return "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"; // Three non-breaking spaces for alignment
  };

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
            Average Time
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
                  {columnKey === "name" ? (
                    <span>
                      {getMedalEmoji(item._avgTimeRank)}
                      {getKeyValue(item, columnKey)}
                    </span>
                  ) : columnKey === "avgTimeSpent" ? (
                    formatTime(item.avgTimeSpent)
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
