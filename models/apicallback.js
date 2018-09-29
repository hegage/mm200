 var apiCallback = (error, results, section, req, res) => {
        if (error) {
            var apiResult = {};

            apiResult.meta = {
                table: section,
                type: "collection",
                total: 0
            }
            apiResult.data = error;

            res.json(apiResult);
        }

        var resultJson = JSON.stringify(results);
        resultJson = JSON.parse(resultJson);
        var apiResult = {};

        apiResult.data = resultJson;

        return res.json(apiResult);
    };

    module.exports = apiCallback;