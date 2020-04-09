import { Test } from "./models/test";

export class TestService {
    public async getAllTests(): Promise<Test[]> {
        const url = '/api/v1/tests';
        var result = await this.httpGet(url);
        return result.json();
    }

    public async executeTest(test: Test): Promise<string> {
        const url = '/api/v1/execute';
        return await this.httpPost<string>(url, test);
    }

    private async httpGet(url: string): Promise<Response> {
        const request: RequestInit = {
            method: 'GET'
        }
        return await fetch(url, request);
    }

    private async httpPost<T>(url: string, body: any): Promise<T> {
        var promise = new Promise<T>((resolve, reject) => {
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            http.send(JSON.stringify(body));
            http.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.responseText) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        resolve();
                    }

                }
                if (this.status > 399) {
                    reject(this.statusText);
                }
            };
        });
        return await promise;
    }
}
