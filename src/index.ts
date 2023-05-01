import dotenv from "dotenv";
dotenv.config();
import env from "env-var";

import { FurAffinityClient, SubmissionListing } from "fa.js";
import axios from "axios";
import cheerio from "cheerio";

import { consola } from "consola";
import cliProgress from "cli-progress";
const ora = (await import("ora")).default;

const delay = env.get("API_CALL_DELAY").default(750).asInt();
const sleep = (ms: number = delay) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    // Get the cookies for the source and target accounts
    const cookies = {
        source: {
            a: await consola.prompt(
                'Paste the "a" cookie from the source account (the old account):'
            ),
            b: await consola.prompt(
                'Paste the "b" cookie from the source account (the old account):'
            )
        },
        target: {
            a: await consola.prompt(
                'Paste the "a" cookie from the target account (the new account):'
            ),
            b: await consola.prompt(
                'Paste the "b" cookie from the target account (the new account):'
            )
        }
    };

    const sourceAcctFAC = new FurAffinityClient(
        `a=${cookies.source.a}; b=${cookies.source.b}`
    );
    const targetAcctFAC = new FurAffinityClient(
        `a=${cookies.target.a}; b=${cookies.target.b}`
    );

    const sourceAcctAxios = axios.create({
        baseURL: "https://furaffinity.net",
        responseType: "document",
        headers: {
            Cookie: `a=${cookies.source.a}; b=${cookies.source.b}`
        }
    });
    const targetAcctAxios = axios.create({
        baseURL: "https://furaffinity.net",
        responseType: "document",
        headers: {
            Cookie: `a=${cookies.target.a}; b=${cookies.target.b}`
        }
    });

    // Get usernames of each account, for additional verification
    // I don't think fa.js has a property or method for getting this
    const sourceUsername = cheerio
        .load((await sourceAcctAxios.get("/")).data)("img.loggedin_user_avatar")
        .attr("alt");
    if (!sourceUsername) {
        consola.error("Could not log into the source account!");
        consola.error(
            "Please make sure you pasted the right cookie values in, and make sure that the theme is set to Modern (accessible from https://www.furaffinity.net/controls/settings/)."
        );
        process.exit();
    }

    await sleep();

    const targetUsername = cheerio
        .load((await targetAcctAxios.get("/")).data)("img.loggedin_user_avatar")
        .attr("alt");
    if (!targetUsername) {
        consola.error("Could not log into the target account!");
        consola.error(
            "Please make sure you pasted the right cookie values in, and make sure that the theme is set to Modern (accessible from https://www.furaffinity.net/controls/settings/)."
        );
        process.exit();
    }

    if (
        !(await consola.prompt(
            `Logged into source account ${sourceUsername} and target account ${targetUsername}. Is this correct?`,
            {
                type: "confirm"
            }
        ))
    ) {
        consola.info(
            "Please restart the script and re-enter the appropriate cookie values."
        );
        process.exit();
    }
    console.log("");

    // This is shit and I screwed myself over by not thinking this through at all
    // I'll come back to this eventually
    const transferSelections = {
        favorites: false,
        watches: false
    };

    (
        await consola.prompt("What would you like to transfer?", {
            type: "multiselect",
            options: [
                { value: "favorites", label: "Favorites" },
                { value: "watches", label: "Watches" }
            ]
        })
    ).map((selection) => {
        transferSelections[selection as "favorites" | "watches"] = true;
    });

    let done = false;

    // I didn't think this through at all
    const sourceFavorites: SubmissionListing[] = [];
    const targetExistingFavorites: SubmissionListing[] = [];
    done = false;

    if (transferSelections.favorites) {
        const sourceFavoritesIter = sourceAcctFAC.getUserFavorites(sourceUsername);
        const getSourceFavoritesSpinner = ora(
            `Getting favorites list from ${sourceUsername}...`
        ).start();
        do {
            const res = await sourceFavoritesIter.next();
            sourceFavorites.push(...res.value);
            getSourceFavoritesSpinner.text = `Getting favorites list from ${sourceUsername}... (${sourceFavorites.length.toLocaleString()} items thus far)`;
            if (res.done) {
                done = res.done;
            }
            await sleep();
        } while (!done);
        getSourceFavoritesSpinner.succeed(
            `Finished reading ${sourceFavorites.length.toLocaleString()} favorites from ${sourceUsername}`
        );

        const getTargetFavoritesSpinner = ora(
            `Getting existing favorites list from ${targetUsername}...`
        ).start();
        done = false;
        const targetFavoritesIter = targetAcctFAC.getUserFavorites(targetUsername);
        do {
            const res = await targetFavoritesIter.next();
            targetExistingFavorites.push(...res.value);
            getTargetFavoritesSpinner.text = `Getting favorites list from ${targetUsername}... (${targetExistingFavorites.length.toLocaleString()} items thus far)`;
            if (res.done) {
                done = res.done;
            }
            await sleep();
        } while (!done);
        getTargetFavoritesSpinner.succeed(
            `Finished reading ${targetExistingFavorites.length.toLocaleString()} favorites from ${targetUsername}`
        );
    }

    const sourceWatchlist: string[] = [];
    const targetWatchlist: string[] = [];

    if (transferSelections.watches) {
        const getSourceWatchlistSpinner = ora(
            `Getting watchlist from ${sourceUsername}...`
        ).start();
        done = false;
        let page = 1;
        do {
            const $ = cheerio.load(
                (await sourceAcctAxios.get(`/watchlist/by/${sourceUsername}/${page}`))
                    .data
            );
            const watchedAccts = $(".watch-list a");
            if (watchedAccts.length > 0) {
                watchedAccts.each((i, el) => {
                    sourceWatchlist.push($(el).attr("href")!.slice(6, -1));
                });
                getSourceWatchlistSpinner.text = `Getting watchlist from ${sourceUsername}... (${sourceWatchlist.length.toLocaleString()} accounts thus far)`;
                page += 1;

                await sleep();
            } else {
                done = true;
            }
        } while (!done);
        getSourceWatchlistSpinner.succeed(
            `Finished reading ${sourceWatchlist.length.toLocaleString()} watched accounts from ${sourceUsername}`
        );

        const getTargetWatchlistSpinner = ora(
            `Getting existing watchlist from ${targetUsername}...`
        ).start();
        done = false;
        page = 1;
        do {
            const $ = cheerio.load(
                (await sourceAcctAxios.get(`/watchlist/by/${targetUsername}/${page}`))
                    .data
            );
            const watchedAccts = $(".watch-list a");
            if (watchedAccts.length > 0) {
                watchedAccts.each((i, el) => {
                    targetWatchlist.push($(el).attr("href")!.slice(6, -1));
                });
                getTargetWatchlistSpinner.text = `Getting watchlist from ${targetUsername}... (${targetWatchlist.length.toLocaleString()} accounts thus far)`;
                page += 1;

                await sleep();
            } else {
                done = true;
            }
        } while (!done);
        getTargetWatchlistSpinner.succeed(
            `Finished reading ${targetWatchlist.length.toLocaleString()} watched accounts from ${targetUsername}`
        );
    }

    const computeDifferenceSpinner = ora(
        `Determining what actions need to be taken...`
    ).start();
    const submissionsDiff = sourceFavorites.filter(
        (source) => !targetExistingFavorites.some((target) => source.id === target.id)
    );
    const watchDiff = sourceWatchlist.filter((item) => !targetWatchlist.includes(item));
    computeDifferenceSpinner.succeed();

    console.log("");
    if (transferSelections.favorites)
        consola.info(
            `${submissionsDiff.length.toLocaleString()} submissions will be favorited on ${targetUsername}.`
        );
    if (transferSelections.watches)
        consola.info(
            `${watchDiff.length.toLocaleString()} users will be watched on ${targetUsername}.`
        );
    if (
        !(await consola.prompt(`Do you wish to continue?`, {
            type: "confirm"
        }))
    ) {
        consola.info("Exiting.");
        process.exit();
    }
    console.log("");

    const progressBars = new cliProgress.MultiBar(
        {
            clearOnComplete: false,
            hideCursor: true,
            format: `{type} | [\u001b[32m{bar}\u001b[0m] {percentage}% | {value}/{total}`
        },
        cliProgress.Presets.shades_classic
    );

    const favoritesBar = progressBars.create(submissionsDiff.length, 0);
    const watchBar = progressBars.create(watchDiff.length, 0);

    favoritesBar.update(0, { type: "Favorites" });
    watchBar.update(0, { type: "Watches  " });

    if (transferSelections.favorites) {
        // Reverse the favorites list so it adds favorites in the order that they were originally favorited in
        submissionsDiff.reverse();

        // I'd use a map here but I don't want to hammer FA's servers all at once...
        for (const submission of submissionsDiff) {
            let $ = cheerio.load(
                (await targetAcctAxios.get(submission.self_link)).data
            );
            // I dislike this
            let favoriteLink: string;
            $(".submission-content .favorite-nav a").each((i, el) => {
                if ($(el).attr("href")!.startsWith(`/fav/${submission.id}/?key=`)) {
                    favoriteLink = $(el).attr("href")!;
                }
            });

            await sleep();

            // I'm kinda afraid to uncomment this lmao
            // want to make sure it works 100% before running it
            // Just double check that the appropriate link is there first at runtime
            if (favoriteLink! === undefined) {
                consola.error(
                    `Something went wrong! Submission "${submission.title}" by ${submission.artist_name} (ID: ${submission.id}) doesn't have a favorite button!\n` +
                        `This might be because the ${targetUsername} account does not have mature/adult artwork enabled in its settings (https://www.furaffinity.net/controls/settings/).`
                );
                process.exit(1);
            }
            $ = cheerio.load((await targetAcctAxios.get(favoriteLink)).data);
            let success = false;
            $(".submission-content .favorite-nav a").each((i, el) => {
                if ($(el).attr("href")!.startsWith(`/unfav/${submission.id}`)) {
                    success = true;
                }
            });
            if (!success) {
                consola.error(
                    `Something went wrong! Submission "${submission.title}" by ${submission.artist_name} (ID: ${submission.id}) wasn't favorited when pressed!`
                );
                process.exit(1);
            }

            await sleep();

            favoritesBar.increment();
        }
    }

    if (transferSelections.watches) {
        for (const account of watchDiff) {
            const $ = cheerio.load(
                (await targetAcctAxios.get(`/user/${account}/`)).data
            );
            // I dislike this
            let watchLink: string;
            $("userpage-nav-header > userpage-nav-interface-buttons a").each(
                (i, el) => {
                    if ($(el).attr("href")!.startsWith(`/watch/${account}/?key=`)) {
                        watchLink = $(el).attr("href")!;
                    }
                }
            );

            await sleep();

            if (watchLink! === undefined) {
                consola.error(
                    `Something went wrong! Account ${account} doesn't have a valid watch button!\n` +
                        `Either they deactivated their account, they blocked ${targetUsername}, or something's wrong with my code.`
                );
            } else {
                const $ = cheerio.load((await targetAcctAxios.get(watchLink)).data);

                const res = $(".redirect-message").text();
                if (!res.endsWith("has been added to your watch list!")) {
                    consola.error(
                        `Something went wrong! Attempting to watch ${account} resulted in this message:`
                    );
                    consola.error(res);
                }

                await sleep();
            }

            watchBar.increment();
        }
    }

    progressBars.stop();

    consola.success("All operations have completed successfully.");
}

main();
