export class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.fullName = data.full_name || '';
        this.email = data.email || '';
        this.createdAt = data.created_at ? new Date(data.created_at) : null;
    }

    get initials() {
        return this.fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
