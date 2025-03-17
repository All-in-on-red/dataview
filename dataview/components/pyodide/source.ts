export default async function get_source(file_path:string) {
    let file = await fetch(file_path)
    let content = await file.text()
    return content
}