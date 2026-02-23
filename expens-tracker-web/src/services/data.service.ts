import { api } from "./api";

export const dataService = {
    exportCSV: async () => {
        const response = await api.get("data/export", { responseType: "blob" })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "trasacoes.csv")
        document.body.appendChild(link)
        link.click()
        link.remove()
    },
    resetData: async () => {
        const response = await api.post("data/reset")
        return response.data
    }
}