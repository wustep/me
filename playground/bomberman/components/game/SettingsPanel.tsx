// @ts-nocheck
import { Button } from "../ui/button"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet"
import { Settings, RotateCcw } from "lucide-react"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"

type SettingsPanelProps = {
	debug: boolean
	onDebugChange: (enabled: boolean) => void
	onReset: () => void
}

export default function SettingsPanel({
	debug,
	onDebugChange,
	onReset,
}: SettingsPanelProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon">
					<Settings className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Game Settings</SheetTitle>
				</SheetHeader>
				<div className="mt-4 space-y-4">
					<div className="flex items-center justify-between space-x-2">
						<Label htmlFor="debug-mode">Debug Mode</Label>
						<Switch
							id="debug-mode"
							checked={debug}
							onCheckedChange={onDebugChange}
						/>
					</div>

					<div className="pt-4 border-t">
						<Button variant="outline" onClick={onReset} className="w-full">
							<RotateCcw className="mr-2 h-4 w-4" />
							Reset Game
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
