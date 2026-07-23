// Documentenkluis-bestanden (P0-4). Sleutel-schema: documents/{uuid}-{filename},
// zodat gelijknamige uploads elkaar nooit overschrijven.
export function buildDocumentKey(filename: string): string {
	return `documents/${crypto.randomUUID()}-${filename}`;
}

export function putDocument(bucket: R2Bucket, key: string, file: File) {
	return bucket.put(key, file.stream(), {
		httpMetadata: { contentType: file.type || 'application/octet-stream' }
	});
}

export function deleteDocument(bucket: R2Bucket, key: string) {
	return bucket.delete(key);
}

export function getDocument(bucket: R2Bucket, key: string) {
	return bucket.get(key);
}
