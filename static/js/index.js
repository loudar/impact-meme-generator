let meme_img = document.getElementById('meme-img');
let upload_button = document.getElementById('upload-image');
let fit_button = document.getElementById('change-fit');
let screenshot_button = document.getElementById('take-screenshot');

let flash_enabled = true;
let ui_enabled = true;

const image_constraints = [ 'cover', 'contain', 'stretch' ];
let current_fit = meme_img.classList.item(0);

function set_image(url) {
    meme_img.style.backgroundImage = `url(${url})`;
}

function change_fit() {
    fit_button.classList.add('active');
    setTimeout(() => {
        fit_button.classList.remove('active');
    }, 500);

    let index = image_constraints.indexOf(current_fit);
    index++;
    if (index >= image_constraints.length) index = 0;
    current_fit = image_constraints[index];
    
    meme_img.className = current_fit;

    const button_image = fit_button.querySelector('img');
    button_image.src = `/img/fit-${current_fit}.svg`;
    button_image.alt = `change image fit (${current_fit})`;
    fit_button.title = `Change Image Fit (${current_fit.replace(/(^.)/g, match => match.toUpperCase())})`;
}

function toggle_ui() {
    ui_enabled = !ui_enabled;
    if (ui_enabled) {
        document.querySelector('#controls').classList.remove('hide');
        document.querySelector('footer').classList.remove('hide');
        document.querySelector('#pride-triangle').classList.remove('hide');
    } else {
        document.querySelector('#controls').classList.add('hide');
        document.querySelector('footer').classList.add('hide');
        document.querySelector('#pride-triangle').classList.add('hide');
    }
}

function screenshot() {
    html2canvas(document.querySelector('main'), {
        logging: false,
        useCORS: true
    }).then(canvas => {
        let link = canvas.toDataURL('png');

        if (flash_enabled) flash();
        
        // click on the image to open it in a new tab!
        canvas.addEventListener('click', (event) => {
            event.button
            window.open(link, '_blank');
        });
        
        let print_delay = 500;
        if (!flash_enabled) print_delay = 0;
        
        // put the screenshot on screen!
        canvas.id = "screenshot";
        setTimeout(() => { document.body.appendChild(canvas); }, print_delay);

        // clear screenshots in 4s!
        setTimeout(() => { clear_screenshots(); }, 4000);
    });
}

function clear_screenshots() {
    const screenshots = document.querySelectorAll('#screenshot');
    screenshots.forEach(screenshot => {
        screenshot.classList.add('leaving');
        setTimeout(() => {
            screenshot.remove();
        }, 1000);
    });
}

function flash() {
    let flashbox = document.createElement('div');
    flashbox.id = "flash";
    document.body.appendChild(flashbox);
    setTimeout(() => {
        flashbox.remove();
    }, 200);
}

// CHANGING IMAGES

upload_button.addEventListener('click', () => { upload_button.click() });
fit_button.addEventListener('click', () => { change_fit(); });
screenshot_button.addEventListener('click', () => { screenshot() });

upload_button.addEventListener('change', () => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const uploaded_image = reader.result;
        // meme_img.src = uploaded_image;
        set_image(uploaded_image);
    });
    reader.readAsDataURL(upload_button.files[0]);
});

// TOGGLE UI BIND

document.addEventListener('keydown', (event) => {
    if (event.key == 'h') toggle_ui();
});