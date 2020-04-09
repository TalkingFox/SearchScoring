import { TestService } from "./test-service";
import { Test } from "./models/test";

export class TestComponent {
    constructor(private service: TestService, private parentElement: HTMLElement) {
        this.buildPage();
    }

    private buildPage(tests: Test[] = []): void {
        this.parentElement.innerHTML = '';
        const bodyElement = document.createElement('div');
        bodyElement.classList.add('table_body');
        if (!tests || tests.length == 0) {
            const noTestsElement = document.createElement('p');
            noTestsElement.textContent = 'Loading Tests...';
            bodyElement.appendChild(noTestsElement);
        }
        tests.forEach((test: Test) => {
            const row = document.createElement('div');
            row.classList.add('body_row');

            const textSection = document.createElement('div');
            textSection.classList.add('text-section');
            textSection.addEventListener('click', (() => {
                alert(JSON.stringify(test));
            }).bind(this));

            const title = document.createElement('div');
            title.classList.add('body_cell', 'title');
            title.textContent = test.Id;
            textSection.appendChild(title);

            const actionSection = document.createElement('div');
            actionSection.classList.add('action-section');
            const isFavorite = document.createElement('div');
            isFavorite.classList.add('small_body_cell');
            const starElement = document.createElement('i');
            starElement.classList.add('fa-star', 'favorite-button');

            isFavorite.appendChild(starElement);
            actionSection.appendChild(isFavorite);

            actionSection.addEventListener('click', (() => {
                this.executeTest(test);
            }).bind(this));

            row.appendChild(textSection);
            row.appendChild(actionSection);
            bodyElement.appendChild(row);
        });
        this.parentElement.appendChild(bodyElement);
    }

    public init(): void {
        this.service.getAllTests().then((tests) => {
            this.buildPage(tests);
        });
    }

    private executeTest(test: Test) {
        
    }
}