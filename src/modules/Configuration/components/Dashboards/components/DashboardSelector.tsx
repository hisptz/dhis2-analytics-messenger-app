import { useDataQuery } from "@dhis2/app-runtime";
import { Field, Transfer } from "@dhis2/ui";
import { debounce, find, uniqBy } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";
import { DashboardsForm } from "../Dashboards";

const dashboardQuery = {
	data: {
		resource: "dashboards",
		params: ({ page, keyword }: { page: number; keyword: string }) => {
			return {
				fields: ["id", "displayName"],
				page,
				pageSize: 50,
				totalPages: true,
				filter: keyword ? [`identifiable:token:${keyword}`] : undefined,
			};
		},
	},
};

interface QueryResponse {
	data: {
		dashboards: Array<{
			id: string;
			displayName: string;
		}>;
		pager: {
			page: number;
			pageCount: number;
			total: number;
		};
	};
}

export function DashboardSelector({ formLoading }: { formLoading: boolean }) {
	const { field, fieldState } = useController<DashboardsForm, "dashboards">({
		name: "dashboards",
	});
	const [options, setOptions] = useState<
		Array<{ label: string; value: string }>
	>([]);
	const { data, loading, refetch } = useDataQuery<QueryResponse>(
		dashboardQuery as never,
		{
			variables: {
				page: 1,
			},
		},
	);

	useEffect(() => {
		if (data) {
			const newData = data?.data?.dashboards?.map((dataualization) => {
				return {
					label: dataualization.displayName,
					value: dataualization.id,
				};
			});
			setOptions((prevState) =>
				uniqBy([...prevState, ...newData], "value"),
			);
		}
	}, [data]);

	const onNextPage = useCallback(() => {
		const page = data?.data?.pager?.page;
		const totalPages = data?.data?.pager?.pageCount;
		if (page !== totalPages) {
			refetch({
				page: (page ?? 0) + 1,
			});
		}
	}, [refetch, data]);

	const onFilter = useCallback(
		(keyword: string) => {
			return refetch({
				keyword,
				page: 1,
			});
		},
		[refetch],
	);
	const onFilterChange = debounce(async ({ value }) => {
		const { data: response } = (await onFilter(
			value,
		)) as unknown as QueryResponse;
		const dashboards = response?.dashboards ?? [];
		setOptions(
			uniqBy(
				[
					...dashboards.map(({ displayName, id }) => ({
						label: displayName,
						value: id,
					})),
				],
				"value",
			),
		);
	}, 1000);

	const updatedOptions = useMemo(() => {
		return uniqBy(
			[
				...(options ?? []),
				...(field.value?.map(
					({ id, name }: { id: string; name: string }) => ({
						label: name,
						value: id,
					}),
				) ?? []),
			],
			"value",
		);
	}, [options]);

	return (
		<Field
			validationText={fieldState.error?.message}
			error={!!fieldState.error}
		>
			<Transfer
				onEndReached={onNextPage}
				filterable
				leftHeader={
					<div className="flex flex-col p-4 text-left pl-0">
						<h3>Available Dashboards</h3>
					</div>
				}
				rightHeader={
					<div className="flex flex-col p-4 text-lef pl-0">
						<h3>Selected Dashboards</h3>
					</div>
				}
				loadingPicked={formLoading}
				loading={loading}
				options={updatedOptions}
				onFilterChange={onFilterChange}
				selected={
					field?.value?.map(({ id }: { id: string }) => id) ?? []
				}
				onChange={({ selected }: { selected: string[] }) => {
					field.onChange(
						selected?.map((value) => ({
							id: value,
							name: find(updatedOptions, ["value", value])?.label,
						})),
					);
				}}
			/>
		</Field>
	);
}
