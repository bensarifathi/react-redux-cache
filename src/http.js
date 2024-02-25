import axios from "axios";


class AxiosWithCache {
    constructor() {
        this.cache = new Map();
        this.freshnessThreshold = 60 * 5 * 1000; // 5 minutes
        this.http = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            headers: {
                "Content-type": "application/json"
            }
        });
    }

    isFresh(cachedData) {
        return Date.now() - cachedData.timestamp < this.freshnessThreshold;
    }

    async get(url, config) {
        try {
            const cachedData = this.cache.get(url);
            if (cachedData && this.isFresh(cachedData)) {
                console.log("Cache hit !")
                return this.cache.get(url)
            }
            const response = await this.http.get(url, config);
            this.cache.set(url, {
                data: response.data,
                timestamp: Date.now()
            });
            return response;
        }
        catch (error) {
            return Promise.reject(error)
        }

    }

    async post(url, data, config) {
        return this.http.post(url, data, config);
    }

    async put(url, data, config) {
        return this.http.put(url, data, config)
    }

    async patch(url, data, config) {
        return this.http.patch(url, data, config)
    }

    async delete(url, config){
        return this.http.delete(url, config)
    }
}

const httpClient = new AxiosWithCache();


export default httpClient;
