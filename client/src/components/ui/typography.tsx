import {
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  PProps,
  MutedProps,
  SmallProps,
  LargeProps,
  LeadProps,
  InlineCodeProps,
  ListProps,
  TableProps,
  BlockquoteProps,
} from "@/types/components/ui/typography";

export function H1({ children }: H1Props) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  );
}

export function H2({ children }: H2Props) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function H3({ children }: H3Props) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function H4({ children }: H4Props) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function P({ children }: PProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function Muted({ children }: MutedProps) {
  return <p className="text-muted-foreground text-sm">{children}</p>;
}

export function Small({ children }: SmallProps) {
  return <small className="text-sm leading-none font-medium">{children}</small>;
}

export function Large({ children }: LargeProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function Lead({ children }: LeadProps) {
  return <p className="text-muted-foreground text-xl">{children}</p>;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}
export function List({ options }: ListProps) {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      {options.map((option) => (
        <li key={option}>{option}</li>
      ))}
    </ul>
  );
}

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="even:bg-muted m-0 border-t p-0">
            {headers.map((header) => (
              <th
                key={header}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="even:bg-muted m-0 border-t p-0">
              {row.map((cell) => (
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}
