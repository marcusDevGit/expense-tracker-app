import { useSettingsStore } from "@/stores/settings.store";

export function useFormatters() {
    const { currency, dateFormat } = useSettingsStore();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: 'currency',
            currency: currency,
        }).format(value)
    };

    const formatDate = (date: string | Date) => {
        const d = new Date(date);

        if (dateFormat === "MM/DD/YYYY") {
            return d.toLocaleDateString("en-US")
        }
        if (dateFormat === "YYYY/MM/DD") {
            return d.toLocaleDateString("ja-JP")
        }
        return d.toLocaleDateString("pt-BR")
    };
    return { formatCurrency, formatDate };
}