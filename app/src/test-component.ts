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
        var header = document.createElement('div');
        header.classList.add("header_row");
        var titleCell = document.createElement('div');
        titleCell.classList.add('body_cell');
        titleCell.textContent = 'Test Id';

        var actionCell = document.createElement('div');
        actionCell.classList.add('small_body_cell');
        actionCell.textContent = "Action!"
        actionCell.style.textAlign = "center";

        header.appendChild(titleCell);
        header.appendChild(actionCell);
        bodyElement.appendChild(header);

        tests.forEach((test: Test) => {
            const row = document.createElement('div');
            row.classList.add('body_row');

            const textSection = document.createElement('div');
            textSection.classList.add('text-section');
            textSection.addEventListener('click', (() => {
                alert(JSON.stringify(test, null, 4));
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
            starElement.classList.add('fas', 'fa-play-circle');

            isFavorite.appendChild(starElement);
            actionSection.appendChild(isFavorite);

            actionSection.addEventListener('click', (() => {
                alert('executing test' + JSON.stringify(test));
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