export default function EmptyState({ icon: Icon, title, message }: { icon: React.ComponentType<{ size: number, className: string }>, title: string, message: string }) {
    return (<div className="flex flex-col items-center justify-center h-40 text-primary/80">
        <Icon size={40} className="mb-2" />
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm">{message}</p>
    </div>)
}