if (( $# < 1 )); then
    echo "Please specify Scholar URL:PORT as the first parameter!"
	exit
fi

mockImage="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg=="

# meta=("ui" "navigation" "basket" "footer" "header")
for i in {16..25}
		do
			curl --data "imageData=$mockImage" "http://$1/api/screenshot/$i" &
      sleep 0.1
		done

wait
