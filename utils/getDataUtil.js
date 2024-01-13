export const getDataUtil = new class {
    post = async (req) => {
        return new Promise((resolve, reject) => {
            try {
                let body = '';
                req
                    .on('data', chunk => {
                        body += chunk.toString();
                    })
                    .on('end', () => {
                        resolve(body);
                    });
            } catch(error) {
                reject(error);
            }
        })
    }
}