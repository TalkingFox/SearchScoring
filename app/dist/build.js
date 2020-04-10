!function(Q){var U={};function F(B){if(U[B])return U[B].exports;var t=U[B]={i:B,l:!1,exports:{}};return Q[B].call(t.exports,t,t.exports,F),t.l=!0,t.exports}F.m=Q,F.c=U,F.d=function(Q,U,B){F.o(Q,U)||Object.defineProperty(Q,U,{enumerable:!0,get:B})},F.r=function(Q){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(Q,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(Q,"__esModule",{value:!0})},F.t=function(Q,U){if(1&U&&(Q=F(Q)),8&U)return Q;if(4&U&&"object"==typeof Q&&Q&&Q.__esModule)return Q;var B=Object.create(null);if(F.r(B),Object.defineProperty(B,"default",{enumerable:!0,value:Q}),2&U&&"string"!=typeof Q)for(var t in Q)F.d(B,t,function(U){return Q[U]}.bind(null,t));return B},F.n=function(Q){var U=Q&&Q.__esModule?function(){return Q.default}:function(){return Q};return F.d(U,"a",U),U},F.o=function(Q,U){return Object.prototype.hasOwnProperty.call(Q,U)},F.p="/dist/",F(F.s=0)}([function(module,__webpack_exports__,__webpack_require__){"use strict";eval("// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./src/test-service.ts\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nclass TestService {\r\n    getAllTests() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const url = '/api/v1/tests';\r\n            var result = yield this.httpGet(url);\r\n            return result.json();\r\n        });\r\n    }\r\n    executeTest(test) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const url = '/api/v1/execute';\r\n            return yield this.httpPost(url, test);\r\n        });\r\n    }\r\n    httpGet(url) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            const request = {\r\n                method: 'GET'\r\n            };\r\n            return yield fetch(url, request);\r\n        });\r\n    }\r\n    httpPost(url, body) {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            var promise = new Promise((resolve, reject) => {\r\n                var http = new XMLHttpRequest();\r\n                http.open('POST', url, true);\r\n                http.setRequestHeader('Content-Type', 'application/json');\r\n                http.send(JSON.stringify(body));\r\n                http.onreadystatechange = function () {\r\n                    if (this.readyState === XMLHttpRequest.DONE) {\r\n                        if (this.responseText) {\r\n                            resolve(JSON.parse(this.responseText));\r\n                        }\r\n                        else {\r\n                            resolve();\r\n                        }\r\n                    }\r\n                    if (this.status > 399) {\r\n                        reject(this.statusText);\r\n                    }\r\n                };\r\n            });\r\n            return yield promise;\r\n        });\r\n    }\r\n}\r\n\n// CONCATENATED MODULE: ./src/test-component.ts\nclass TestComponent {\r\n    constructor(service, parentElement) {\r\n        this.service = service;\r\n        this.parentElement = parentElement;\r\n        this.buildPage();\r\n    }\r\n    buildPage(tests = []) {\r\n        this.parentElement.innerHTML = '';\r\n        const bodyElement = document.createElement('div');\r\n        bodyElement.classList.add('table_body');\r\n        if (!tests || tests.length == 0) {\r\n            const noTestsElement = document.createElement('p');\r\n            noTestsElement.textContent = 'Loading Tests...';\r\n            bodyElement.appendChild(noTestsElement);\r\n        }\r\n        var header = document.createElement('div');\r\n        header.classList.add(\"header_row\");\r\n        var titleCell = document.createElement('div');\r\n        titleCell.classList.add('body_cell');\r\n        titleCell.textContent = 'Test Id';\r\n        var actionCell = document.createElement('div');\r\n        actionCell.classList.add('small_body_cell');\r\n        actionCell.textContent = \"Action!\";\r\n        actionCell.style.textAlign = \"center\";\r\n        header.appendChild(titleCell);\r\n        header.appendChild(actionCell);\r\n        bodyElement.appendChild(header);\r\n        tests.forEach((test) => {\r\n            const row = document.createElement('div');\r\n            row.classList.add('body_row');\r\n            const textSection = document.createElement('div');\r\n            textSection.classList.add('text-section');\r\n            textSection.addEventListener('click', (() => {\r\n                alert(JSON.stringify(test, null, 4));\r\n            }).bind(this));\r\n            const title = document.createElement('div');\r\n            title.classList.add('body_cell', 'title');\r\n            title.textContent = test.Id;\r\n            textSection.appendChild(title);\r\n            const actionSection = document.createElement('div');\r\n            actionSection.classList.add('action-section');\r\n            const isFavorite = document.createElement('div');\r\n            isFavorite.classList.add('small_body_cell');\r\n            const starElement = document.createElement('i');\r\n            starElement.classList.add('fas', 'fa-play-circle');\r\n            isFavorite.appendChild(starElement);\r\n            actionSection.appendChild(isFavorite);\r\n            actionSection.addEventListener('click', (() => {\r\n                alert('executing test' + JSON.stringify(test));\r\n                this.executeTest(test);\r\n            }).bind(this));\r\n            row.appendChild(textSection);\r\n            row.appendChild(actionSection);\r\n            bodyElement.appendChild(row);\r\n        });\r\n        this.parentElement.appendChild(bodyElement);\r\n    }\r\n    init() {\r\n        this.service.getAllTests().then((tests) => {\r\n            this.buildPage(tests);\r\n        });\r\n    }\r\n    executeTest(test) {\r\n    }\r\n}\r\n\n// CONCATENATED MODULE: ./src/index.ts\nvar src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\n\r\n\r\nvar service = new TestService();\r\nfunction init() {\r\n    return src_awaiter(this, void 0, void 0, function* () {\r\n        var parent = document.getElementById('app');\r\n        var component = new TestComponent(service, parent);\r\n        component.init();\r\n    });\r\n}\r\ninit().then();\r\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdGVzdC1zZXJ2aWNlLnRzPzRmNjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Rlc3QtY29tcG9uZW50LnRzPzM4NDAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzP2ZmYjQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUVPLE1BQU0sV0FBVztJQUNQLFdBQVc7O1lBQ3BCLE1BQU0sR0FBRyxHQUFHLGVBQWUsQ0FBQztZQUM1QixJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekIsQ0FBQztLQUFBO0lBRVksV0FBVyxDQUFDLElBQVU7O1lBQy9CLE1BQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDO1lBQzlCLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFTLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFYSxPQUFPLENBQUMsR0FBVzs7WUFDN0IsTUFBTSxPQUFPLEdBQWdCO2dCQUN6QixNQUFNLEVBQUUsS0FBSzthQUNoQjtZQUNELE9BQU8sTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVhLFFBQVEsQ0FBSSxHQUFXLEVBQUUsSUFBUzs7WUFDNUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzdDLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLElB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L0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVmLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDN0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQixXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLElBQUk7UUFDUCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sV0FBVyxDQUFDLElBQVU7SUFFOUIsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7QUM5RTRDO0FBQ0k7QUFFakQsSUFBSSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUVoQyxTQUFlLElBQUk7O1FBQ2YsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQWdCLENBQUM7UUFDM0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0NBQUE7QUFFRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVzdCB9IGZyb20gXCIuL21vZGVscy90ZXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGVzdFNlcnZpY2Uge1xyXG4gICAgcHVibGljIGFzeW5jIGdldEFsbFRlc3RzKCk6IFByb21pc2U8VGVzdFtdPiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gJy9hcGkvdjEvdGVzdHMnO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBhd2FpdCB0aGlzLmh0dHBHZXQodXJsKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZXhlY3V0ZVRlc3QodGVzdDogVGVzdCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gJy9hcGkvdjEvZXhlY3V0ZSc7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuaHR0cFBvc3Q8c3RyaW5nPih1cmwsIHRlc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgaHR0cEdldCh1cmw6IHN0cmluZyk6IFByb21pc2U8UmVzcG9uc2U+IHtcclxuICAgICAgICBjb25zdCByZXF1ZXN0OiBSZXF1ZXN0SW5pdCA9IHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXdhaXQgZmV0Y2godXJsLCByZXF1ZXN0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGh0dHBQb3N0PFQ+KHVybDogc3RyaW5nLCBib2R5OiBhbnkpOiBQcm9taXNlPFQ+IHtcclxuICAgICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdmFyIGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgaHR0cC5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgICAgICAgICBodHRwLnNlbmQoSlNPTi5zdHJpbmdpZnkoYm9keSkpO1xyXG4gICAgICAgICAgICBodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFhNTEh0dHBSZXF1ZXN0LkRPTkUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZVRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPiAzOTkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QodGhpcy5zdGF0dXNUZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUZXN0U2VydmljZSB9IGZyb20gXCIuL3Rlc3Qtc2VydmljZVwiO1xyXG5pbXBvcnQgeyBUZXN0IH0gZnJvbSBcIi4vbW9kZWxzL3Rlc3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0Q29tcG9uZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZTogVGVzdFNlcnZpY2UsIHByaXZhdGUgcGFyZW50RWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmJ1aWxkUGFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYnVpbGRQYWdlKHRlc3RzOiBUZXN0W10gPSBbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICBjb25zdCBib2R5RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGJvZHlFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3RhYmxlX2JvZHknKTtcclxuICAgICAgICBpZiAoIXRlc3RzIHx8IHRlc3RzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vVGVzdHNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgICAgICBub1Rlc3RzRWxlbWVudC50ZXh0Q29udGVudCA9ICdMb2FkaW5nIFRlc3RzLi4uJztcclxuICAgICAgICAgICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQobm9UZXN0c0VsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJoZWFkZXJfcm93XCIpO1xyXG4gICAgICAgIHZhciB0aXRsZUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aXRsZUNlbGwuY2xhc3NMaXN0LmFkZCgnYm9keV9jZWxsJyk7XHJcbiAgICAgICAgdGl0bGVDZWxsLnRleHRDb250ZW50ID0gJ1Rlc3QgSWQnO1xyXG5cclxuICAgICAgICB2YXIgYWN0aW9uQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGFjdGlvbkNlbGwuY2xhc3NMaXN0LmFkZCgnc21hbGxfYm9keV9jZWxsJyk7XHJcbiAgICAgICAgYWN0aW9uQ2VsbC50ZXh0Q29udGVudCA9IFwiQWN0aW9uIVwiXHJcbiAgICAgICAgYWN0aW9uQ2VsbC5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG5cclxuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGVDZWxsKTtcclxuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoYWN0aW9uQ2VsbCk7XHJcbiAgICAgICAgYm9keUVsZW1lbnQuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcclxuXHJcbiAgICAgICAgdGVzdHMuZm9yRWFjaCgodGVzdDogVGVzdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgcm93LmNsYXNzTGlzdC5hZGQoJ2JvZHlfcm93Jyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0U2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICB0ZXh0U2VjdGlvbi5jbGFzc0xpc3QuYWRkKCd0ZXh0LXNlY3Rpb24nKTtcclxuICAgICAgICAgICAgdGV4dFNlY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkodGVzdCwgbnVsbCwgNCkpO1xyXG4gICAgICAgICAgICB9KS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2JvZHlfY2VsbCcsICd0aXRsZScpO1xyXG4gICAgICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRlc3QuSWQ7XHJcbiAgICAgICAgICAgIHRleHRTZWN0aW9uLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvblNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgYWN0aW9uU2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdhY3Rpb24tc2VjdGlvbicpO1xyXG4gICAgICAgICAgICBjb25zdCBpc0Zhdm9yaXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGlzRmF2b3JpdGUuY2xhc3NMaXN0LmFkZCgnc21hbGxfYm9keV9jZWxsJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG4gICAgICAgICAgICBzdGFyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmYXMnLCAnZmEtcGxheS1jaXJjbGUnKTtcclxuXHJcbiAgICAgICAgICAgIGlzRmF2b3JpdGUuYXBwZW5kQ2hpbGQoc3RhckVsZW1lbnQpO1xyXG4gICAgICAgICAgICBhY3Rpb25TZWN0aW9uLmFwcGVuZENoaWxkKGlzRmF2b3JpdGUpO1xyXG5cclxuICAgICAgICAgICAgYWN0aW9uU2VjdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCgnZXhlY3V0aW5nIHRlc3QnICsgSlNPTi5zdHJpbmdpZnkodGVzdCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leGVjdXRlVGVzdCh0ZXN0KTtcclxuICAgICAgICAgICAgfSkuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQodGV4dFNlY3Rpb24pO1xyXG4gICAgICAgICAgICByb3cuYXBwZW5kQ2hpbGQoYWN0aW9uU2VjdGlvbik7XHJcbiAgICAgICAgICAgIGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGJvZHlFbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2UuZ2V0QWxsVGVzdHMoKS50aGVuKCh0ZXN0cykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkUGFnZSh0ZXN0cyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleGVjdXRlVGVzdCh0ZXN0OiBUZXN0KSB7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGVzdFNlcnZpY2UgfSBmcm9tIFwiLi90ZXN0LXNlcnZpY2VcIjtcclxuaW1wb3J0IHsgVGVzdENvbXBvbmVudCB9IGZyb20gXCIuL3Rlc3QtY29tcG9uZW50XCI7XHJcblxyXG52YXIgc2VydmljZSA9IG5ldyBUZXN0U2VydmljZSgpO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHZhciBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICB2YXIgY29tcG9uZW50ID0gbmV3IFRlc3RDb21wb25lbnQoc2VydmljZSwgcGFyZW50KTtcclxuICAgIGNvbXBvbmVudC5pbml0KCk7XHJcbn1cclxuXHJcbmluaXQoKS50aGVuKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///0\n")}]);