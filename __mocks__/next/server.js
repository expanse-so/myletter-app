module.exports = {
  NextRequest: class NextRequest {
    constructor(url, options = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.headers = new Headers(options.headers || {});
      this.body = options.body || null;
    }

    json() {
      return Promise.resolve(JSON.parse(this.body));
    }
  },
  NextResponse: {
    json: (data, options = {}) => {
      const response = {
        status: options.status || 200,
        json: () => Promise.resolve(data),
      };
      return response;
    },
  },
};