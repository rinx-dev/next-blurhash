export default function ExteralLink({ url, title }: { url: string, title: string }) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{title}</a>
}
