import knox from 'knox'

export const uploader = knox.createClient({
	key: 'AKIAI2FHLHJOZ3ULLOIQ',
	secret: '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',
	bucket: 'hackagroup',
	region: 'sa-east-1',
	acl: 'public-read'
})
