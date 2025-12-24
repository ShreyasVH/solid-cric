import { Show } from "solid-js";

export default function PaginationBox(props) {
    const page = props.page;
    const totalCount = props.totalCount;
    const goToPage = props.goToPage;
    const limit = props.limit;

    const getTotalPages = () => (((totalCount() - (totalCount() % limit)) / limit) + (((totalCount() % limit) === 0) ? 0 : 1));

    const getPageRange = () => {
        const totalPages = getTotalPages();
        let range = [];
        for (let i = Math.max(1, page() - 2); i <= Math.min(totalPages, page() + 2); i++) {
            range.push(i);
        }

        return range;
    };
    
    return (
        <div className="pagination-box">
            <Show when={page() > 2}>
                <div className="pagination-button" onClick={() => goToPage(1)}>
                    {'<<'}
                </div>
            </Show>
            <Show when={page() > 1}>
                <div className="pagination-button" onClick={() => goToPage(page() - 1)}>
                    {'<'}
                </div>
            </Show>
            <For each={getPageRange()}>
                {(i) => (
                    <div classList={{
                        'pagination-button': true,
                        'active': i === page()
                    }}
                         onClick={() => goToPage(i)}
                    >
                        {i}
                    </div>
                )}
            </For>

            <Show when={page() < (getTotalPages() - 1)}>
                <div className="pagination-button" onClick={() => goToPage(page() + 1)}>
                    {'>'}
                </div>
            </Show>
            <Show when={page() < (getTotalPages() - 2)}>
                <div className="pagination-button" onClick={() => goToPage(getTotalPages())}>
                    {'>>'}
                </div>
            </Show>
        </div>
    );
}