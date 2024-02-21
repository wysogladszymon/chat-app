export function getChatID(id: string, id2: string): string {
  return id > id2 ? id + id2 : id2 + id;
}


