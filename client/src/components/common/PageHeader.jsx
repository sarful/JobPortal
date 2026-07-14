export default function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}) {
  return (
    <div className="mb-8">
      {breadcrumbs ? (
        <div className="mb-3 text-sm text-slate-500">
          {breadcrumbs}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}