"use client";

/**
 * Component: TaskFilters
 * Author: Tung Pham
 *
 * Responsibility:
 * Provide a compact set of filters (All / Upcoming / Overdue)
 * used to refine which tasks appear in the task grid.
 *
 * Additional Notes:
 * - Implements controlled component behavior.
 * - Does not modify tasks directly; only communicates filter changes.
 */


import styled from "styled-components";

export type TaskFilter = "all" | "upcoming" | "overdue";

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: "All",
  upcoming: "Upcoming",
  overdue: "Overdue",
};

const FilterGroup = styled.div`
  display: inline-flex;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  padding: 0.15rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
`;

const FilterButton = styled.button<{ $active: boolean }>`
  border: none;
  border-radius: 0.4rem;
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.1s ease;

  background-color: ${({ $active }) =>
    $active ? "#2563eb" : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#4b5563")};

  ${({ $active }) =>
    $active
      ? "box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);"
      : ""}

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "#1d4ed8" : "rgba(17, 24, 39, 0.04)"};
  }
`;

type TaskFiltersProps = {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
};

export default function TaskFilters({ value, onChange }: TaskFiltersProps) {
  const filters: TaskFilter[] = ["all", "upcoming", "overdue"];

  return (
    <FilterGroup>
      {filters.map((filter) => (
        <FilterButton
          key={filter}
          type="button"
          $active={filter === value}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABELS[filter]}
        </FilterButton>
      ))}
    </FilterGroup>
  );
}

