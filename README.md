# Scholar - Visual Regression Engine

Visual regression platform (hosted and self-hosted).

## Key Queries

### Find all approved snapshots by Team

Requires HASH key of Team ID + RANGE key of Snapshot ID?

*	SnapshotID of: `type#name#browser`
	* Allows querying by type `begins_with = main`

### Find Main version of Snapshot

Requires HASH key of Team ID and Snapshot name

*	HASH of Team ID and RANGE of `main#name` can be used to lookup specific snapshot

### Find Historical versions of Snapshot

Requires HASH key of Team ID and Snapshot name

*	HASH of Team ID and RANGE of `version#name#number#browser` can be used to store historical versions
*	This means all versions can be queried by `begins_with` `version#name`

### Find candidates of Snapshot

Requires HASH key of Team ID and Snapshot name

*	`candidate#name#browser#timestamp` can be used to store candidates with enough granularity

## Key Actions

* Insert new Snapshot candidate
	* Requires Team ID and Snapshot name
	*	Lookup Team ID + `main#snapshot-name`
	*	If main does not exist, create it
	*	If main exists, compare and if different - auto generate Snapshot ID `candidate#name`
* Approve candidate
	* Requires Team ID and Snapshot name
		* Snapshot name to create new (main) result
		* Snapshot name and previous v_ to generate a new (v_) record of prior (main)
		* Snapshot name and RANGE key of candidate to be approved in order to delete candidate record
* Delete Snapshot
	* Requires Team ID + Snapshot name - find and remove all `main#name`, `candidate#name` and `version#name`


## Contributing

All PRs and well formed issues are welcome!

If you think this a cool piece of software, please consider:

<a href="https://www.buymeacoffee.com/alexnaish" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/arial-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
