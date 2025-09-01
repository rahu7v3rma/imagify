import clsx from 'clsx';
import { ReactNode } from 'react';

export interface H1Props {
  children: ReactNode;
  className?: string;
}

export interface H2Props {
  children: ReactNode;
  className?: string;
}

export interface H3Props {
  children: ReactNode;
  className?: string;
}

export interface H4Props {
  children: ReactNode;
  className?: string;
}

export interface PProps {
  children: ReactNode;
  className?: string;
}

export interface MutedProps {
  children: ReactNode;
  className?: string;
}

export interface SmallProps {
  children: ReactNode;
  className?: string;
}

export interface LargeProps {
  children: ReactNode;
  className?: string;
}

export interface LeadProps {
  children: ReactNode;
  className?: string;
}

export interface InlineCodeProps {
  children: ReactNode;
  className?: string;
}

export interface ListProps {
  options: ReactNode[];
  className?: string;
}

export interface TableProps {
  headers: string[];
  rows: string[][];
  className?: string;
}

export interface BlockquoteProps {
  children: ReactNode;
  className?: string;
}

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export function H1({ children, className }: H1Props) {
  return (
    <h1
      className={clsx(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: H2Props) {
  return (
    <h2
      className={clsx(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: H3Props) {
  return (
    <h3
      className={clsx(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className }: H4Props) {
  return (
    <h4
      className={clsx(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function P({ children, className }: PProps) {
  return <p className={clsx('leading-7', className)}>{children}</p>;
}

export function Muted({ children, className }: MutedProps) {
  return (
    <p className={clsx('text-muted-foreground text-sm', className)}>
      {children}
    </p>
  );
}

export function Small({ children, className }: SmallProps) {
  return (
    <small className={clsx('text-sm leading-none font-medium', className)}>
      {children}
    </small>
  );
}

export function Large({ children, className }: LargeProps) {
  return (
    <div className={clsx('text-lg font-semibold', className)}>{children}</div>
  );
}

export function Lead({ children, className }: LeadProps) {
  return (
    <p className={clsx('text-muted-foreground text-xl', className)}>
      {children}
    </p>
  );
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={clsx(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
    >
      {children}
    </code>
  );
}
export function List({ options, className }: ListProps) {
  return (
    <ul className={clsx('my-6 ml-6 list-disc [&>li]:mt-2', className)}>
      {options.map((option, index) => (
        <li key={index}>{option}</li>
      ))}
    </ul>
  );
}

export function Table({ headers, rows, className }: TableProps) {
  return (
    <div className={clsx('my-6 w-full overflow-y-auto', className)}>
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

export function Blockquote({ children, className }: BlockquoteProps) {
  return (
    <blockquote className={clsx('mt-6 border-l-2 pl-6 italic', className)}>
      {children}
    </blockquote>
  );
}

export function Link({ children, href, className }: LinkProps) {
  return (
    <a
      href={href}
      className={clsx(
        'text-primary-600 underline hover:text-primary-700',
        className,
      )}
    >
      {children}
    </a>
  );
}
